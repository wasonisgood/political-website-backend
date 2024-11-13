// src/models/Activity.js
const db = require('../config/database');

class Activity {
    static async findAll() {
        const [activities] = await db.query(`
            SELECT a.*, ac.name as category_name 
            FROM activities a
            JOIN activity_categories ac ON a.category_id = ac.id
            ORDER BY a.date ASC
        `);
        return activities;
    }

    static async findById(id) {
        const [activity] = await db.query('SELECT * FROM activities WHERE id = ?', [id]);
        if (activity.length === 0) return null;

        // Get agenda
        const [agenda] = await db.query(
            'SELECT * FROM activity_agenda WHERE activity_id = ? ORDER BY order_num',
            [id]
        );

        return {
            ...activity[0],
            agenda
        };
    }

    static async create(activityData) {
        const connection = await db.getConnection();
        await connection.beginTransaction();

        try {
            const { 
                title, description, date, time_start, time_end,
                location, category_id, image_url, external_link, agenda 
            } = activityData;

            const [result] = await connection.query(
                `INSERT INTO activities 
                (title, description, date, time_start, time_end, location, category_id, image_url, external_link) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [title, description, date, time_start, time_end, location, category_id, image_url, external_link]
            );

            const activityId = result.insertId;

            if (agenda && agenda.length) {
                const agendaValues = agenda.map((item, index) => 
                    [activityId, item.time_slot, item.description, index + 1]
                );
                await connection.query(
                    'INSERT INTO activity_agenda (activity_id, time_slot, description, order_num) VALUES ?',
                    [agendaValues]
                );
            }

            await connection.commit();
            return activityId;

        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static async update(id, activityData) {
        const connection = await db.getConnection();
        await connection.beginTransaction();

        try {
            const { 
                title, description, date, time_start, time_end,
                location, category_id, image_url, external_link, agenda 
            } = activityData;

            await connection.query(
                `UPDATE activities SET 
                    title = ?, description = ?, date = ?, 
                    time_start = ?, time_end = ?, location = ?,
                    category_id = ?, image_url = ?, external_link = ?
                WHERE id = ?`,
                [title, description, date, time_start, time_end, location, 
                 category_id, image_url, external_link, id]
            );

            if (agenda) {
                await connection.query('DELETE FROM activity_agenda WHERE activity_id = ?', [id]);
                if (agenda.length) {
                    const agendaValues = agenda.map((item, index) => 
                        [id, item.time_slot, item.description, index + 1]
                    );
                    await connection.query(
                        'INSERT INTO activity_agenda (activity_id, time_slot, description, order_num) VALUES ?',
                        [agendaValues]
                    );
                }
            }

            await connection.commit();
            return true;

        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static async delete(id) {
        const connection = await db.getConnection();
        await connection.beginTransaction();

        try {
            await connection.query('DELETE FROM activity_agenda WHERE activity_id = ?', [id]);
            await connection.query('DELETE FROM activities WHERE id = ?', [id]);

            await connection.commit();
            return true;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }
}

module.exports = Activity;

