import React from 'react';
import {Link} from 'react-router-dom';
export const LinksList= ({links})=>{
    if(!links.length){
        return <p className={'center'}>Items not found</p>
    }
    return(<table>
        <thead>
        <tr>
            <th>N</th>
            <th>From(original)</th>
            <th>To(short)</th>
            <th>Open</th>
        </tr>
        </thead>

        <tbody>
        {links.map((link,index)=>{
            return(
                <tr key={link._id}>
                    <td>{index}</td>
                    <td>{link.from}</td>
                    <td>{link.to}</td>
                    <td>
                        <Link to={`detail/${link._id}`}>Open</Link>
                    </td>
                </tr>
            )
        })}
        </tbody>
    </table>)
}