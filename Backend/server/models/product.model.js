import { getConn } from '../databaseConnect.js';

const productModel = {
  fetchAll: async () => {
    const conn = getConn();
    const [rows] = await conn.query('SELECT * FROM product_plant');
    return rows;
  },

  getById: async (id) => {
    const conn = getConn();
    const [[row]] = await conn.query(
      'SELECT * FROM product_plant WHERE plant_id = ?',
      [id]
    );
    return row;
  },
  productInCart: async(id)=>{
    const conn = getConn();
    const [row] = await conn.query(
      'SELECT * FROM product_plant WHERE plant_id IN (?)'
    ,[id]
    )
    return row;
  },
  pagination: async (page, limit) => {
    const conn = getConn();
    const offset = (page - 1) * limit;

    const [[{ total }]] = await conn.query(
      'SELECT COUNT(*) AS total FROM product_plant'
    );

    const [rows] = await conn.query(
      'SELECT * FROM product_plant LIMIT ? OFFSET ?',
      [limit, offset]
    );

    return {
      data: rows,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    };
  },
  delete: async (id) => {
    const conn = getConn();
    const [result] = await conn.query(
      'DELETE FROM product_plant WHERE plant_id=?',
      [id]
    );
    return result;
  },
  insert : async(data)=>{
    const conn = getConn();
    const [result] = await conn.query(
       `INSERT INTO product_plant
      (name, description, price, high, wide, amount, img, light_type_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.name,
        data.description,
        data.price,
        data.high,
        data.wide,
        data.amount,
        data.img,
        data.light_type_id
      ]
    );
    return {
      id: result.insertId,
      ...data
    };
    
  }

};

export default productModel;
