'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Importer le hook pour rediriger

export default function AjouterMembre() {
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
  const router = useRouter(); // Initialiser le routeur pour la redirection

  // Récupérer les données des listes déroulantes au chargement
  useEffect(() => {
    const fetchData = async () => {
      try {
        const metiersRes = await fetch('/api/metiers');
        const niveauxRes = await fetch('/api/niveaux');
        const missionsRes = await fetch('/api/missions');
        const provincesRes = await fetch('/api/provinces');
        const statutsRes = await fetch('/api/statuts');

        setMetiers(await metiersRes.json());
        setNiveaux(await niveauxRes.json());
        setMissions(await missionsRes.json());
        setProvinces(await provincesRes.json());
        setStatuts(await statutsRes.json());
      } catch (error) {
        console.error('Erreur lors du chargement des données :', error);
      }
    };

    fetchData();
  }, []);

  // Mettre à jour les détails de mission en fonction de la mission sélectionnée
  useEffect(() => {
    const fetchDetailsMission = async () => {
      if (form.id_mission) {
        const detailsRes = await fetch(`/api/missions/${form.id_mission}/details`);
        setDetailsMission(await detailsRes.json());
      } else {
        setDetailsMission([]);
      }
    };

    fetchDetailsMission();
  }, [form.id_mission]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/membres', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        alert('Membre ajouté avec succès');
        setForm({
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
        router.push('/membres'); // Redirection vers la liste des membres
      } else {
        alert('Erreur lors de l\'ajout du membre');
      }
    } catch (err) {
      console.error('Erreur lors de l\'ajout du membre :', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <h1 className="text-2xl font-bold">Ajouter un Membre</h1>

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
        placeholder="Date de naissance"
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
        Ajouter
      </button>
    </form>
  );
}
