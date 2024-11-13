const db = require('../config/database');

class Policy {
    static async findAll() {
        try {
            const [policies] = await db.query(`
                SELECT p.*, pc.name as category_name 
                FROM policies p
                JOIN policy_categories pc ON p.category_id = pc.id
            `);
            return policies || [];
        } catch (error) {
            console.error('Error in findAll:', error);
            throw error;
        }
    }

    static async findById(id) {
        try {
            // First check if the policy exists
            const [policies] = await db.query('SELECT * FROM policies WHERE id = ?', [id]);
            
            // If no policy found, return null early
            if (!policies || policies.length === 0) {
                return null;
            }

            // Get the base policy data
            const policy = policies[0];

            // Get objectives with error handling
            const [objectives] = await db.query(
                'SELECT * FROM policy_objectives WHERE policy_id = ?',
                [id]
            );

            // Get implementations with error handling
            const [implementations] = await db.query(
                'SELECT * FROM policy_implementations WHERE policy_id = ? ORDER BY order_num',
                [id]
            );

            // Return complete policy object with empty arrays as defaults
            return {
                ...policy,
                objectives: objectives || [],
                implementations: implementations || []
            };
        } catch (error) {
            console.error('Error in findById:', error);
            throw error;
        }
    }

    static async create(policyData) {
        const connection = await db.getConnection();
        await connection.beginTransaction();

        try {
            const { title, description, content, image_url, category_id, objectives, implementations } = policyData;

            // Insert policy with null checks
            const [result] = await connection.query(
                'INSERT INTO policies (title, description, content, image_url, category_id) VALUES (?, ?, ?, ?, ?)',
                [
                    title || '',
                    description || '',
                    content || '',
                    image_url || null,
                    category_id || null
                ]
            );

            const policyId = result.insertId;

            // Insert objectives with validation
            if (Array.isArray(objectives) && objectives.length > 0) {
                const objectiveValues = objectives
                    .filter(obj => obj && obj.objective) // Filter out invalid objectives
                    .map(obj => [policyId, obj.objective]);
                
                if (objectiveValues.length > 0) {
                    await connection.query(
                        'INSERT INTO policy_objectives (policy_id, objective) VALUES ?',
                        [objectiveValues]
                    );
                }
            }

            // Insert implementations with validation
            if (Array.isArray(implementations) && implementations.length > 0) {
                const implementationValues = implementations
                    .filter(imp => imp && imp.step) // Filter out invalid implementations
                    .map((imp, index) => [
                        policyId,
                        imp.step,
                        index + 1,
                        typeof imp.progress === 'number' ? imp.progress : 0
                    ]);
                
                if (implementationValues.length > 0) {
                    await connection.query(
                        'INSERT INTO policy_implementations (policy_id, step, order_num, progress) VALUES ?',
                        [implementationValues]
                    );
                }
            }

            await connection.commit();
            return policyId;

        } catch (error) {
            await connection.rollback();
            console.error('Error in create:', error);
            throw error;
        } finally {
            connection.release();
        }
    }

    static async update(id, policyData) {
        const connection = await db.getConnection();
        await connection.beginTransaction();

        try {
            // First verify the policy exists
            const [existing] = await connection.query('SELECT id FROM policies WHERE id = ?', [id]);
            if (!existing || existing.length === 0) {
                throw new Error(`Policy with id ${id} not found`);
            }

            const { title, description, content, image_url, category_id, objectives, implementations } = policyData;

            // Update policy with null checks
            await connection.query(
                `UPDATE policies SET 
                    title = ?, 
                    description = ?, 
                    content = ?, 
                    image_url = ?, 
                    category_id = ?
                WHERE id = ?`,
                [
                    title || '',
                    description || '',
                    content || '',
                    image_url || null,
                    category_id || null,
                    id
                ]
            );

            // Update objectives with validation
            if (Array.isArray(objectives)) {
                await connection.query('DELETE FROM policy_objectives WHERE policy_id = ?', [id]);
                
                if (objectives.length > 0) {
                    const objectiveValues = objectives
                        .filter(obj => obj && obj.objective)
                        .map(obj => [id, obj.objective]);
                    
                    if (objectiveValues.length > 0) {
                        await connection.query(
                            'INSERT INTO policy_objectives (policy_id, objective) VALUES ?',
                            [objectiveValues]
                        );
                    }
                }
            }

            // Update implementations with validation
            if (Array.isArray(implementations)) {
                await connection.query('DELETE FROM policy_implementations WHERE policy_id = ?', [id]);
                
                if (implementations.length > 0) {
                    const implementationValues = implementations
                        .filter(imp => imp && imp.step)
                        .map((imp, index) => [
                            id,
                            imp.step,
                            index + 1,
                            typeof imp.progress === 'number' ? imp.progress : 0
                        ]);
                    
                    if (implementationValues.length > 0) {
                        await connection.query(
                            'INSERT INTO policy_implementations (policy_id, step, order_num, progress) VALUES ?',
                            [implementationValues]
                        );
                    }
                }
            }

            await connection.commit();
            return true;

        } catch (error) {
            await connection.rollback();
            console.error('Error in update:', error);
            throw error;
        } finally {
            connection.release();
        }
    }

    static async delete(id) {
        const connection = await db.getConnection();
        await connection.beginTransaction();

        try {
            // First verify the policy exists
            const [existing] = await connection.query('SELECT id FROM policies WHERE id = ?', [id]);
            if (!existing || existing.length === 0) {
                throw new Error(`Policy with id ${id} not found`);
            }

            // Delete related records first
            await connection.query('DELETE FROM policy_objectives WHERE policy_id = ?', [id]);
            await connection.query('DELETE FROM policy_implementations WHERE policy_id = ?', [id]);
            await connection.query('DELETE FROM policies WHERE id = ?', [id]);

            await connection.commit();
            return true;
        } catch (error) {
            await connection.rollback();
            console.error('Error in delete:', error);
            throw error;
        } finally {
            connection.release();
        }
    }
}

module.exports = Policy;