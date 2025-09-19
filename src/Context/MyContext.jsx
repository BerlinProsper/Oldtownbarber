
import React, { createContext, useState, useContext } from 'react';
import { db } from '../Firebase';
import { collection, addDoc } from "firebase/firestore";
import {  getDocs, query, orderBy ,serverTimestamp } from 'firebase/firestore';
import { useEffect } from 'react';
const ServiceContext = createContext();
export const ServiceProvider = ({ children }) => {

  const [selectedService, setSelectedService] = useState([]);


  const [totalPrice, setTotalPrice] = useState(0);
const [historyServices, setHistoryServices] = useState([]) 

const [services, setServices] = useState([]);


  const fetchServices = async () => {
    try {
      const servicesCol = collection(db, "newservices");
      const servicesSnapshot = await getDocs(servicesCol);
      const servicesList = servicesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setServices(servicesList);
    } catch (error) {
      console.error("Error fetching services: ", error);
    }
  };

  useEffect(() => {
  fetchServices();
}, []);



function emptyCart(){
 setHistoryServices([])
   alert("Cart is now empty, No services added!");
setTotalPrice(0);
  window.location.href = "/";
}
const addDocument = async () => {
if (selectedService.length==0){
  return 0;
}
  function generateUniqueCode() {
return new  Date().getTime(); 
}




const date = new Date().toLocaleString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata" // IST timezone
});


  try {
const docRef = await addDoc(collection(db, "services"), {
  id: generateUniqueCode(),
  services: selectedService,
  price: totalPrice,
  date: date,
  timestamp: serverTimestamp()
});

    console.log("Document written with ID: ", docRef.id);
    historyServices.forEach((docSnapshot) => {
        docSnapshot.docs.forEach((doc) => {
            const data = doc.data();
 });
    });
    
    getDocuments();
  } catch (e) {
    console.error("Error adding document: ", e);
  }
  alert("Document added successfully!");
  window.location.href = "/";
};

const colRef = collection(db, 'yourCollectionName');

const q = query(colRef, orderBy('id'));


async function getDocuments() {
  try {
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, doc.data());
    });
    setHistoryServices([querySnapshot])
  } catch (error) {
    console.error('Error getting documents: ', error);
  }
}useEffect(() => {   getDocuments() }, [])



  return (
    <ServiceContext.Provider value={{  selectedService, setSelectedService, totalPrice, setTotalPrice , addDocument , emptyCart, services , fetchServices }}>
      {children}
    </ServiceContext.Provider>
  );
};

export const useServiceContext = () => useContext(ServiceContext);
