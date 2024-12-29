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
    const [rows] = await connection.execute('SELECT * FROM Membres');
    return new Response(JSON.stringify(rows), { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la récupération des membres:', error);
    return new Response(JSON.stringify({ error: 'Erreur interne du serveur' }), { status: 500 });
  } finally {
    await connection.end();
  }
}

export async function POST(req) {
  const {
    nom,
    sexe,
    date_naissance,
    id_metier,
    id_niveau_etude,
    id_mission,
    id_detail_mission,
    telephone,
    email,
    id_province,
    id_statut,
  } = await req.json();

  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    port: process.env.MYSQL_PORT,
  });

  try {
    const query = `
      INSERT INTO Membres 
      (nom, sexe, date_naissance, id_metier, id_niveau_etude, id_mission, id_detail_mission, telephone, email, id_province, id_statut) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await connection.execute(query, [
      nom,
      sexe,
      date_naissance,
      id_metier,
      id_niveau_etude,
      id_mission,
      id_detail_mission || null, // Si id_detail_mission est facultatif
      telephone,
      email,
      id_province,
      id_statut,
    ]);

    return new Response(JSON.stringify({ message: 'Membre ajouté avec succès' }), { status: 201 });
  } catch (error) {
    console.error('Erreur lors de l\'ajout du membre:', error);
    return new Response(JSON.stringify({ error: 'Erreur interne du serveur' }), { status: 500 });
  } finally {
    await connection.end();
  }
}