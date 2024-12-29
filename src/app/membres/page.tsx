'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Membres() {
  const [membres, setMembres] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchMembres = async () => {
      try {
        const response = await fetch('/api/membres');
        const data = await response.json();
        setMembres(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des membres:', error);
      }
    };

    fetchMembres();
  }, []);

  const supprimerMembre = async (id) => {
    const confirmation = confirm("Êtes-vous sûr de vouloir supprimer ce membre ?");
    if (!confirmation) return;

    try {
      const response = await fetch(`/api/membres/${id}`, { method: 'DELETE' });
      if (response.ok) {
        alert('Membre supprimé avec succès');
        setMembres(membres.filter((membre) => membre.id_membre !== id));
      } else {
        alert('Erreur lors de la suppression du membre');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du membre:', error);
    }
  };

  const modifierMembre = (id) => {
    router.push(`/membres/${id}`);
  };

  const ajouterMembre = () => {
    router.push('/membres/ajouter');
  };

  return (
    <main className="p-10">
      <h1 className="text-2xl font-bold mb-6">Liste des Membres</h1>
      <button
        className="bg-green-500 text-white px-4 py-2 rounded mb-6"
        onClick={ajouterMembre}
      >
        + Ajouter un Membre
      </button>
      <div className="overflow-x-auto">
        <table className="table-auto border-collapse border border-gray-300 w-full text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">Nom</th>
              <th className="border border-gray-300 px-4 py-2">Sexe</th>
              <th className="border border-gray-300 px-4 py-2">Date de Naissance</th>
              <th className="border border-gray-300 px-4 py-2">Téléphone</th>
              <th className="border border-gray-300 px-4 py-2">Email</th>
              <th className="border border-gray-300 px-4 py-2">Statut</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {membres.map((membre) => (
              <tr key={membre.id_membre} className="hover:bg-gray-100">
                <td className="border border-gray-300 px-4 py-2">{membre.nom}</td>
                <td className="border border-gray-300 px-4 py-2">{membre.sexe}</td>
                <td className="border border-gray-300 px-4 py-2">{new Date(membre.date_naissance).toLocaleDateString()}</td>
                <td className="border border-gray-300 px-4 py-2">{membre.telephone}</td>
                <td className="border border-gray-300 px-4 py-2">{membre.email}</td>
                <td className="border border-gray-300 px-4 py-2">{membre.id_statut}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                    onClick={() => modifierMembre(membre.id_membre)}
                  >
                    Modifier
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => supprimerMembre(membre.id_membre)}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
