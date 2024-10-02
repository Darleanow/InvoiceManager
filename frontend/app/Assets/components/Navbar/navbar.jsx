import React from 'react';
import styles from './style.css';
import { AiFillDollarCircle } from "react-icons/ai";
import { IoIosPeople } from "react-icons/io";
import { BiSolidReport } from "react-icons/bi";

export default function Navbar() {
    return (
        <div>
            <nav>
                <ul>
                    <div>
                        <AiFillDollarCircle />
                        <li>Billing</li>
                    </div>
                    <div>
                        <IoIosPeople />
                        <li>Clients</li>
                    </div>
                    <div>
                        <BiSolidReport />
                        <li>Reporting</li>
                    </div>
                </ul>
            </nav>
        </div>
    )
}
