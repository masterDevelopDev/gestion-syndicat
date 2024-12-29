'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function ModifierMembre() {
  const [form, setForm] = useState({
    nom: '',
    sexe: '',
    date_naissance: '',
    id_metier: '',
    id_niveau_etude: '',
    id_mission: '',
    id_detail_mission: '',
    telephone: '',
    email: '',
    id_province: '',
    id_statut: '',
  });
  const [metiers, setMetiers] = useState([]);
  const [niveaux, setNiveaux] = useState([]);
  const [missions, setMissions] = useState([]);
  const [detailsMission, setDetailsMission] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [statuts, setStatuts] = useState([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupérer les informations du membre
        const membreRes = await fetch(`/api/membres/${params.id}`);
        const membreData = await membreRes.json();

        // Convertir la date au format attendu (YYYY-MM-DD)
        if (membreData.date_naissance) {
          membreData.date_naissance = membreData.date_naissance.split('T')[0];
        }

        setForm(membreData);

        // Récupérer les listes déroulantes
        const [metiersRes, niveauxRes, missionsRes, provincesRes, statutsRes] = await Promise.all([
          fetch('/api/metiers'),
          fetch('/api/niveaux'),
          fetch('/api/missions'),
          fetch('/api/provinces'),
          fetch('/api/statuts'),
        ]);

        setMetiers(await metiersRes.json());
        setNiveaux(await niveauxRes.json());
        setMissions(await missionsRes.json());
        setProvinces(await provincesRes.json());
        setStatuts(await statutsRes.json());
      } catch (error) {
        console.error('Erreur lors du chargement des données :', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  useEffect(() => {
    const fetchDetailsMission = async () => {
      if (form.id_mission) {
        try {
          const detailsRes = await fetch(`/api/missions/${form.id_mission}/details`);
          setDetailsMission(await detailsRes.json());
        } catch (error) {
          console.error('Erreur lors de la récupération des détails de la mission:', error);
        }
      } else {
        setDetailsMission([]);
      }
    };

    fetchDetailsMission();
  }, [form.id_mission]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/membres/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        alert('Membre mis à jour avec succès');
        router.push('/membres');
      } else {
        alert('Erreur lors de la mise à jour du membre');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du membre:', error);
    }
  };

  if (loading) {
    return <p>Chargement des données...</p>;
  }

  return (
    <main className="p-10">
      <h1 className="text-2xl font-bold mb-6">Modifier un Membre</h1>
      <form onSubmit={handleUpdate} className="space-y-4">
        <input
          type="text"
          placeholder="Nom"
          value={form.nom}
          onChange={(e) => setForm({ ...form, nom: e.target.value })}
          className="border p-2 w-full"
          required
        />
        <select
          value={form.sexe}
          onChange={(e) => setForm({ ...form, sexe: e.target.value })}
          className="border p-2 w-full"
          required
        >
          <option value="">Sélectionnez le sexe</option>
          <option value="ذكر">ذكر</option>
          <option value="أنثى">أنثى</option>
        </select>
        <input
          type="date"
          value={form.date_naissance}
          onChange={(e) => setForm({ ...form, date_naissance: e.target.value })}
          className="border p-2 w-full"
          required
        />
        <select
          value={form.id_metier}
          onChange={(e) => setForm({ ...form, id_metier: e.target.value })}
          className="border p-2 w-full"
          required
        >
          <option value="">Sélectionnez le métier</option>
          {metiers.map((metier) => (
            <option key={metier.id_metier} value={metier.id_metier}>
              {metier.nom_metier}
            </option>
          ))}
        </select>
        <select
          value={form.id_niveau_etude}
          onChange={(e) => setForm({ ...form, id_niveau_etude: e.target.value })}
          className="border p-2 w-full"
          required
        >
          <option value="">Sélectionnez le niveau d'étude</option>
          {niveaux.map((niveau) => (
            <option key={niveau.id_niveau} value={niveau.id_niveau}>
              {niveau.nom_niveau}
            </option>
          ))}
        </select>
        <select
          value={form.id_mission}
          onChange={(e) => setForm({ ...form, id_mission: e.target.value })}
          className="border p-2 w-full"
          required
        >
          <option value="">Sélectionnez la mission</option>
          {missions.map((mission) => (
            <option key={mission.id_mission} value={mission.id_mission}>
              {mission.nom_mission}
            </option>
          ))}
        </select>
        <select
          value={form.id_detail_mission}
          onChange={(e) => setForm({ ...form, id_detail_mission: e.target.value })}
          className="border p-2 w-full"
        >
          <option value="">Sélectionnez le détail de la mission</option>
          {detailsMission.map((detail) => (
            <option key={detail.id_detail} value={detail.id_detail}>
              {detail.nom_detail}
            </option>
          ))}
        </select>
        <input
          type="tel"
          placeholder="Téléphone"
          value={form.telephone}
          onChange={(e) => setForm({ ...form, telephone: e.target.value })}
          className="border p-2 w-full"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="border p-2 w-full"
          required
        />
        <select
          value={form.id_province}
          onChange={(e) => setForm({ ...form, id_province: e.target.value })}
          className="border p-2 w-full"
          required
        >
          <option value="">Sélectionnez la province</option>
          {provinces.map((province) => (
            <option key={province.id_province} value={province.id_province}>
              {province.nom_province}
            </option>
          ))}
        </select>
        <select
          value={form.id_statut}
          onChange={(e) => setForm({ ...form, id_statut: e.target.value })}
          className="border p-2 w-full"
          required
        >
          <option value="">Sélectionnez le statut</option>
          {statuts.map((statut) => (
            <option key={statut.id_statut} value={statut.id_statut}>
              {statut.nom_statut}
            </option>
          ))}
        </select>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Mettre à jour
        </button>
        <button
          type="button"
          onClick={() => router.push('/membres')}
          className="bg-gray-500 text-white px-4 py-2 rounded ml-2"
        >
          Annuler
        </button>
      </form>
    </main>
  );
}
