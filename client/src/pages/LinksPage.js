import React,{useState,useContext,useEffect,useCallback} from  'react';
import {useHttp} from "../hooks/http.hook";
import {AuthContext} from "../context/AuthContext";
import {Loader} from "../components/Loader";
import {LinksList} from "../components/LinksList";
export const LinksPage = ()=>{
    const [links,setLinks]=useState([]);
    const {request,loading}=useHttp();
    const {token}=useContext(AuthContext);
    const getLinks=useCallback(async ()=>{
        const allLink = await request('/api/link','GET',null,{
            Authorization:`Bearer ${token}`,
        });
        setLinks(allLink);
    },[request,token]);
    useEffect(()=>{
        getLinks()
    },[getLinks]);
    if(loading){
        return <Loader/>
    }
    return(
        <>
            {!loading && <LinksList links={links}/>}
        </>
    )
}