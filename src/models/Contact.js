// src/models/Contact.js
const db = require('../config/database');

class Contact {
    static async findAll() {
        try {
            const [messages] = await db.query(
                'SELECT * FROM contact_messages ORDER BY created_at DESC'
            );
            return messages;
        } catch (error) {
            console.error('Error in findAll:', error);
            throw error;
        }
    }

    static async findById(id) {
        try {
            const [messages] = await db.query(
                'SELECT * FROM contact_messages WHERE id = ?',
                [id]
            );
            // 如果沒有找到訊息，返回 null
            return messages.length > 0 ? messages[0] : null;
        } catch (error) {
            console.error('Error in findById:', error);
            throw error;
        }
    }

    static async create(messageData) {
        try {
            const { name, email, message } = messageData;
            const [result] = await db.query(
                'INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)',
                [name, email, message]
            );
            return result.insertId;
        } catch (error) {
            console.error('Error in create:', error);
            throw error;
        }
    }

    static async updateStatus(id, status) {
        try {
            const [result] = await db.query(
                'UPDATE contact_messages SET status = ? WHERE id = ?',
                [status, id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error in updateStatus:', error);
            throw error;
        }
    }

    static async delete(id) {
        try {
            const [result] = await db.query(
                'DELETE FROM contact_messages WHERE id = ?',
                [id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error in delete:', error);
            throw error;
        }
    }
}

module.exports = Contact;