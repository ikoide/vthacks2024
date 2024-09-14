 const HomePage = ( { userData }: any ): JSX.Element => {
    return (
        <div>
            <h1>Home Page</h1>
            {userData && Object.keys(userData).length > 0 ? (
                <p>Welcome, {userData.name}!</p>
                ) : (
                <p>Welcome, Guest!</p>
                )}
        </div>
        );
        
}

export default HomePage;