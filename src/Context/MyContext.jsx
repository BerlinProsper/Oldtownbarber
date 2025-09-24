
import React, { createContext, useState, useContext } from 'react';
import { db } from '../Firebase';
import { collection, addDoc } from "firebase/firestore";
import {  getDocs, query, orderBy ,serverTimestamp } from 'firebase/firestore';
import { useEffect } from 'react';
const ServiceContext = createContext();
export const ServiceProvider = ({ children }) => {

  const [selectedService, setSelectedService] = useState([]);
  
  const [cashOrUpi, setCashOrUpi] = useState('');
  const [paymentOption, setPaymentOption] = useState(0)
  const [totalPrice, setTotalPrice] = useState(0);
const [historyServices, setHistoryServices] = useState([]) 
const [addButtonClicked, setAddButtonClicked]=useState(false)
const [services, setServices] = useState([]);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
const [freeServices, setFreeServices] = useState([]);

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
  console.log("hi");
  
}, []);



function emptyCart(){
 setHistoryServices([])
   alert("Cart is now empty, No services added!");
setTotalPrice(0);
  window.location.href = "/";
}
const addDocument = async () => {
  
          setAddButtonClicked(false);

if (selectedService.length==0){
  return 0;
}

if (paymentOption==0){
  setPaymentOption(1);
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
const docRef = await addDoc(collection(db, "historyservices"), {
  id: generateUniqueCode(),
  services: selectedService,
  price: totalPrice,
  payment: cashOrUpi,
  date: date,
  timestamp: serverTimestamp()
});

    console.log("Document written with ID: ", docRef.id);
    historyServices.forEach((docSnapshot) => {
        docSnapshot.docs.forEach((doc) => {
            const data = doc.data();
 });
    });
      setCashOrUpi('');
    setPaymentOption(0);
    getDocuments();
  } catch (e) {
    alert("Error adding document: ", e);
  }

  window.location.href = "/";


};
 
    const handleDrawerOpen = () => setDrawerOpen(true);
  const handleDrawerClose = () => setDrawerOpen(false);
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
    <ServiceContext.Provider value={{  selectedService, setSelectedService, totalPrice, setTotalPrice , addDocument , emptyCart, services , fetchServices , paymentOption , setPaymentOption , cashOrUpi, setCashOrUpi , addButtonClicked, setAddButtonClicked, drawerOpen,  handleDrawerClose, handleDrawerOpen, setFreeServices, freeServices}}>
      {children}
    </ServiceContext.Provider>
  );
};

export const useServiceContext = () => useContext(ServiceContext);
