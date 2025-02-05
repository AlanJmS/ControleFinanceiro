import Card from '../components/Card';
import './Resume.css';
import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip, YAxis, Legend } from 'recharts';

export default function ResumePage() {

    const data = [
        { nome: "teste 1", valor: 100 },
        { nome: "teste 2", valor: 200 },
        { nome: "teste 3", valor: 150 },
        { nome: "teste 4", valor: 30 }
    ]

    return (
        <div className="chart__container">
            <div className="chart">
                <ResponsiveContainer width='100%' height='100%' >
                    <BarChart
                        width={100}
                        height={100}
                        data={data}
                    >
                        <XAxis dataKey="nome" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey='valor' barSize={30} fill="#8884d8" />
                        <Legend />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}