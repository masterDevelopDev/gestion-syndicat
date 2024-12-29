import mysql from 'mysql2/promise';

export async function GET(req, { params }) {
  const { id } = params; // Assurez-vous que l'objet params est utilisé correctement

  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT,
  });

  try {
    const [rows] = await connection.execute('SELECT * FROM Membres WHERE id_membre = ?', [id]);
    if (rows.length === 0) {
      return new Response(JSON.stringify({ error: 'Membre non trouvé' }), { status: 404 });
    }
    return new Response(JSON.stringify(rows[0]), { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la récupération du membre :', error);
    return new Response(JSON.stringify({ error: 'Erreur interne du serveur' }), { status: 500 });
  } finally {
    await connection.end();
  }
}

export async function PATCH(req, { params }) {
  const { id } = params;
  const updatedData = await req.json();

  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT,
  });

  try {
    // Exclure `created_at` des données mises à jour
    const { created_at, updated_at, ...updateFields } = updatedData;

    // Ajouter le champ `updated_at` avec un format valide
    const fields = Object.keys(updateFields)
      .map((key) => `${key} = ?`)
      .join(', ');
    const values = Object.values(updateFields);

    // Ajoutez la valeur de `updated_at` avec l'heure actuelle au format MySQL
    const currentTimestamp = new Date()
      .toISOString()
      .slice(0, 19)
      .replace('T', ' ');
    const query = `UPDATE Membres SET ${fields}, updated_at = ? WHERE id_membre = ?`;
    values.push(currentTimestamp, id);

    const [result] = await connection.execute(query, values);

    if (result.affectedRows === 0) {
      return new Response(JSON.stringify({ error: 'Membre non trouvé' }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: 'Membre mis à jour avec succès' }), { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du membre :', error);
    return new Response(JSON.stringify({ error: 'Erreur interne du serveur' }), { status: 500 });
  } finally {
    await connection.end();
  }
}

export async function DELETE(req, context) {
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    port: process.env.MYSQL_PORT,
  });

  // Utilisez `await` pour obtenir les paramètres
  const { id } = await context.params;

  try {
    const [result] = await connection.execute('DELETE FROM Membres WHERE id_membre = ?', [id]);
    if (result.affectedRows === 0) {
      return new Response(JSON.stringify({ error: 'Membre introuvable' }), { status: 404 });
    }
    return new Response(JSON.stringify({ message: 'Membre supprimé avec succès' }), { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la suppression du membre:', error);
    return new Response(JSON.stringify({ error: 'Erreur interne du serveur' }), { status: 500 });
  } finally {
    await connection.end();
  }
}
