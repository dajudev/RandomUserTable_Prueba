import { SortBy, type User} from '../types'

interface Props{
    deletedUser: (email:string) => void
    showColors:boolean
    users: User[],
    changeSorting: (sort:SortBy)=> void
}

export function  Userlist ( {deletedUser,showColors, users,changeSorting }: Props ){

    return(
        <table width={'100%'}>
            <thead>
                <tr>
                    <th>Foto</th>
                    <th className='pointer' onClick={()=>changeSorting(SortBy.NAME)}>Nombre</th>
                    <th className='pointer' onClick={()=>changeSorting(SortBy.LAST)}>Apellido</th>
                    <th className='pointer' onClick={()=>changeSorting(SortBy.COUNTRY)}>Pais</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {
                users.map((user,index) =>
                {
                    const backColor = index % 2 == 0 ? '#333':'#555'
                    const color = showColors ? backColor: 'transparent'
                    return (
                        <tr key={user.email} style={{backgroundColor:color}}>
                            <td style={{backgroundColor:color}}>
                                <img src = {user.picture.thumbnail} alt="" />
                            </td>
                            <td>
                                {user.name.first}
                            </td>
                            <td>
                                {user.name.last}
                            </td>
                            <td>
                                {user.location.country}
                            </td>
                            <td>
                                <button onClick={()=>deletedUser(user.email)}>Eliminar</button>
                            </td>
                        </tr>
                )})
                }
            </tbody>
        </table>
    )
}