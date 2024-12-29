import mysql from 'mysql2/promise';

export async function GET(req) {
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    port: process.env.MYSQL_PORT,
  });

  try {
    const [rows] = await connection.execute('SELECT id_mission, nom_mission FROM Missions');
    return new Response(JSON.stringify(rows), { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la récupération des missions :', error);
    return new Response(JSON.stringify({ error: 'Erreur interne du serveur' }), { status: 500 });
  } finally {
    await connection.end();
  }
}
