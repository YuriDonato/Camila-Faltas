"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { AiFillHeart } from "react-icons/ai";
import axios from 'axios';

// Key Servidor fnAFIxCaqxAAziBS8X5XaPHvb2PpdbcTY3G8wU8d

export default function Home() {
  const [materias, setMaterias] = useState<string[]>([]);
  const [faltas, setFaltas] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/materias');
        setMaterias(response.data.materias);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const addMateria = async () => {
    const novaMateria = prompt('Digite o nome da matéria:');
    if (novaMateria) {
      try {
        await axios.post('/api/materias', { materia: novaMateria });
        setMaterias([...materias, novaMateria]);
        setFaltas({ ...faltas, [novaMateria]: 0 });
      } catch (error) {
        console.error(error);
      }
    }
  };

  const removerMateria = (materia: string) => {
    const novasMaterias = materias.filter((m) => m !== materia);
    const { [materia]: _, ...novasFaltas } = faltas;
    setMaterias(novasMaterias);
    setFaltas(novasFaltas);
  };

  const incrementarFalta = (materia: string) => {
    setFaltas({ ...faltas, [materia]: faltas[materia] + 1 });
  };

  const faltasRestantes = (materia: string) => {
    const faltasAtuais = faltas[materia] || 0;
    return 4 - faltasAtuais;
  };

    return (
      <div className="flex justify-center items-center min-h-screen bg-pink-200">
        <div className="p-4 bg-white rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-4 flex items-center">Controle de Presenças do Meu Amor. <AiFillHeart />  </h1>
          {materias.length === 0 ? (
            <p className="text-gray-500">Nenhuma matéria adicionada.</p>
          ) : (
            <ul>
              {materias.map((materia) => (
                <li
                  key={materia}
                  className="flex justify-between items-center mb-2"
                >
                  <span>{materia}</span>
                  <div className="flex items-center">
                    <span className="mr-2">Faltas: {faltas[materia] || 0}</span>
                    <span className="mr-2">
                      Faltas Restantes: {faltasRestantes(materia)}
                    </span>
                    <button
                      className="px-2 py-1 rounded bg-red-500 text-white"
                      onClick={() => incrementarFalta(materia)}
                    >
                      Falta
                    </button>
                    <button
                      className="px-2 py-1 rounded bg-red-500 text-white ml-2"
                      onClick={() => removerMateria(materia)}
                    >
                      Remover
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <button
            className="px-2 py-1 rounded bg-blue-500 text-white mt-4"
            onClick={addMateria}
          >
            Adicionar Matéria
          </button>
        </div>
      </div>
    );
  };

