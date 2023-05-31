import React, { useEffect, useState } from 'react';
import { getFirestore, collection, query, where, onSnapshot } from 'firebase/firestore';
import { auth } from '../helpers/firebase';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaInfoCircle } from 'react-icons/fa';
import Title from '../components/TitleComponent';
import ButtonComponent from '../components/ButtonComponent';
import BigButtonComponent from '../components/BigButtonComponent';

const Inicio = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const getCampaigns = () => {
    setLoading(true);
    
    const db = getFirestore();
    const q = query(collection(db, "campaigns"), where("creadaPor", "==", auth.currentUser.uid));
  
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let campaignData = [];
      querySnapshot.forEach((doc) => {
        campaignData.push({ id: doc.id, ...doc.data() });
      });
      setCampaigns(campaignData);
      setLoading(false);
    });
  
    return unsubscribe;
  }

  useEffect(() => {
    const unsubscribe = getCampaigns();
    return () => unsubscribe();
  }, []);

  const handleDetail = (campaign) => {
    navigate('/detalle-campana', { state: { campaign } });
  };

  const handleCreateCampaign = () => {
    console.log('Crear campaña');
    navigate('/crear-campana');
  };

  return (
    <div className="flex w-full h-screen justify-center items-center p-8 bg-gray-200 overflow-y-hidden">
      <div className="flex flex-col items-center w-full max-w-3xl">

        <button className="cursor-pointer bg-adstream-500 hover:bg-adstream-300 text-white py-2 px-8 text-center text-base font-semibold rounded-md transition duration-400 absolute top-2 right-2 flex justify-center items-center" onClick={() => navigate('/perfil-usuario')}>
          <FaUser size={20} className='mr-3'/> Ver Perfil
        </button>

        <Title title="Campañas:" />

        {loading ? 
          <p className="text-gray-700 text-lg my-8 select-none">Cargando Campañas...</p> 
            :
         campaigns.length !== 0 ?
          <ul className="list-none p-0 max-h-96 overflow-y-scroll flex flex-col items-center w-full max-w-xl mb-4">
            {campaigns.map((campaign) => (
              <li key={campaign.id} className="border border-gray-300 rounded-lg mb-3 shadow-md bg-white pb-5 pt-5 text-gray-800 flex flex-row justify-between w-full items-center px-2 md:px-4">
                <p className="text-xl mr-4">{campaign.nombre}</p>
                <ButtonComponent Icon={FaInfoCircle} text="Detalle" onClick={() => handleDetail(campaign)} />
              </li>
            ))}
          </ul>
           :
          <p className="text-gray-700 text-lg my-8">No hay campañas</p>
        }

        <BigButtonComponent
          text="+ Crear Campaña"
          handleClick={handleCreateCampaign}
        />

      </div>
    </div>
  );
};

export default Inicio;
