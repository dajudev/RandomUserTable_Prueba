import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import { Userlist } from './components/UsersList';
import { type User, SortBy } from './types';

function App() {
  const [users, setUsers] =  useState<User[]>([]);
  const [showColors, setShowColores] = useState(false);
  const [sorting, setSorting] = useState<SortBy>(SortBy.NONE);
  const [filter,setFilter] = useState<string|null>(null);
  const originalUsers = useRef<User[]>([]);
  //useRef -> para guardar un valor 
  // que queremos compartir entre renderizados
  // pero que al cambiar no vuelva a renderizar el componente

  
  const toggleColors = ()=>{
    setShowColores(!showColors);
  }

  //UTILIZANDO EL ESTADO ANTERIOR 
  const toggleSortCountry = ()=>{
    const sortingValue = sorting == SortBy.NONE ? SortBy.COUNTRY : SortBy.NONE
    setSorting(sortingValue);
  }

  const handleReset = ()=>{
    setUsers(originalUsers.current)
  }

  const handleDelete = (email:string)=>{
    const filteredUsers = users.filter((user)=> user.email != email)
    setUsers(filteredUsers);
  }

  const handleChangeSort = (sort:SortBy)=>{
    setSorting(sort);
  }

  //METODO MAL  POR QUE EL SORT MUTA EL ARREGLO POR LO QUE YA EL ARREGLO QUEDARIA 
  //ORDENADO ASI NO SE QUIERA
/*   const sortedUsers = sortCountry 
  ? users.sort((a,b)=>{
    return a.location.country.localeCompare(b.location.country);
  }) : users
 */

  //SOLUCIÓN COPIA DEL ARREGLO 7/10
/*   const sortedUsers = sortCountry 
  ? [... users].sort((a,b)=>{
    return a.location.country.localeCompare(b.location.country);
  }) : users */


  
  const filterUsers = useMemo(()=>{
    return filter  != null && filter.length > 0  
  ? users.filter((user)=>{
    return user.location.country.toLowerCase().includes(filter.toLowerCase())
  })
  : users
  }, [users,filter])

  //SOLUCIÓN COPIA DEL ARREGLO 10/10
  //hacer los calculos con un unico estado
  const sortedUsers = useMemo(()=>{

    if(sorting == SortBy.COUNTRY) return filterUsers.toSorted((a,b)=>a.location.country.localeCompare(b.location.country))
      
    if(sorting == SortBy.NAME) return filterUsers.toSorted((a,b)=>a.name.first.localeCompare(b.name.first))
      
    if(sorting == SortBy.LAST) return filterUsers.toSorted((a,b)=>a.name.last.localeCompare(b.name.last))
  
    return filterUsers
    
  }, [filterUsers, sorting])



  useEffect(() => {

      fetch("https://randomuser.me/api/?results=100").then(res => res.json()).then( res =>{
        setUsers(res.results);
        originalUsers.current = res.results;
      }).catch(err=>{
        console.error(err);
      });

  }, []) //NO OLVIDAR DEPENDENCIAS
  


  return (
    <div>
      <h1>Prueba Tecnica</h1>
        <header>
          <button onClick={toggleColors}>
            Colorear Filas
          </button>
          <button onClick={toggleSortCountry}>
           {sorting != SortBy.NONE ? 'No ordenar por pais'  : 'Ordenar por Pais'}
          </button>
          <button onClick={handleReset}>
           Resetear lista
          </button>
          <input type="text" placeholder='Filtra por pais'  onChange={(e)=>{
            setFilter(e.target.value)
          }}/>

        </header>
        <main>
          <Userlist users={sortedUsers} showColors={showColors} deletedUser={handleDelete} changeSorting={handleChangeSort} />
        </main>
    </div>
  )
}

export default App
