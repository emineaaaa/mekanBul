import Header from "./Header";
import VenueList from "./VenueList";
import VenueReducer from "../services/VenueReducer";
import React from "react";
import VenueDataService from "../services/VenueDataService";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';



function Admin() {
  const location = useLocation();
  const { existingData } = location.state || {};

  const navigate = useNavigate();
  const [venues, dispatchVenues] = React.useReducer(VenueReducer, {
    data: [],
    isLoading: false,
    isSuccess: false,
    isError: false,
    isDeleted: false,
  });
  function handleClick(evt, id) {
    evt.preventDefault();
  
    if (evt.target.name === "Mekan Ekle") {
      return navigate('/admin/addupdate/venue/new', {
        state: { action: "new" },
      });
    } else if (evt.target.name === "Güncelle") {
      return navigate(`/admin/addupdate/venue/${id}`, {
        state: { action: "update" },
      });
    }else if (evt.target.name==="Sil"){
      VenueDataService.removeVenue(id).then(() => {
        dispatchVenues({ type: "REMOVE_VENUE" });
        
      });
    }
  }
  
React.useEffect(() => {
  dispatchVenues({ type: "FETCH_INIT" });

  VenueDataService.listAllVenues()
    .then((result) => {
      dispatchVenues({
        type: "FETCH_SUCCESS",
        payload: result.data,
      });
    })
    .catch((error) => {
      console.error("Venue listesi alınırken bir hata oluştu:", error);
      dispatchVenues({ type: "FETCH_FAILURE" });
    });
}, [venues.isDeleted]);
  return  (
    
    <>
      <Header headerText="Yönetici" motto="Mekanlarınızı Yönetin!" />
      {venues.isError ? (
        <p>
          <strong>Birşeyler ters gitti! ...</strong>
        </p>
      ) : venues.isLoading ? (
        <p>
          <strong>Mekanlar Yükleniyor ...</strong>
        </p>
      ) : (
        venues.isSuccess && (
          <div className="row">
            <VenueList
              venues={venues.data}
              admin={true}
              onClick={handleClick}
            />
          </div>
        )
      )}
    </>
  );
}

export default Admin;
