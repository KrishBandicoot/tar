export function HelloWorld({users, id}){
    //const nombre = "Kkarhua";
    return(
        <div className="container mt-5">
            <h1>Bienvenido a react {users}, con id = {id}</h1>
        </div>);
}