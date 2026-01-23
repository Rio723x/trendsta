
import React from 'react';
import DashboardClient from './DashboardClient';
import { getTrendstaData } from '../lib/dataLoader';



export default function DashboardPage() {

    // Fetch data on the server
    const data = getTrendstaData();



    return <DashboardClient data={data} />;
}
