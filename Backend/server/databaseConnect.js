import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const { MYSQL_HOST, MYSQL_USER, MYSQL_PWD, MYSQL_DB } = process.env;

let pool;

export const initMySQL = async () => {
    try {
        pool = mysql.createPool({
            host: MYSQL_HOST,
            user: MYSQL_USER,
            password: MYSQL_PWD,
            database: MYSQL_DB,
        });
        const connection = await pool.getConnection();
        connection.release();
        console.log('✅ MySQL connected');
        
    } catch (error) {
     console.log(`❌ MySQL connecting failed , ${error.message}`);
    }
   
};

export const getConn = () => {
    if (!pool) {
        throw new Error('❌ Database not initialized');
    }
    return pool;
};
