import { use } from "react";
import { useState } from "react";

import { useEffect } from "react";



const LeftMenu=({profile})=>{

    const[items, setItems]=useState('');

    useEffect(()=>{
        if(profile=='admin'){
            setItems('')
        }
        setItems('')

    },[])



    const RenderHTML=(item)=>{
        if(profile=='admin'){
            return(
                <React.Fragment>
                    <span className="icon-general">Icon</span>
                    <span className="icon-homeText">
                        <NavLink to={item.component}>item.name</NavLink>
                    </span>
                </React.Fragment>
            )
        }

        else{
            return(
                <React.Fragment>
                    <span className="">
                        <span className="number">{item.icon !=''? Icon[item.icon]:item.id}</span>
                    </span>
                </React.Fragment>

            )
            {navigate===true &&
              <span className="icon-home-text">
                <NavLink to={item.component}>{item.name}</NavLink>
              </span>
            }
        }

    }




    



}