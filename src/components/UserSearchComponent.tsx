interface UserSearchComponentProps {
    username: string;
    editableName: string;
}

function UserSearchComponent({ username, editableName }: UserSearchComponentProps) {
    return (
        <div className="flex flex-col p-2 hover:bg-gray-400">
            <div className="flex flex-row gap-1 items-center">
                <img src={`http://localhost:8080/api/users/uploads/profile/${username}`} onError={(e)=> e.currentTarget.src="https://assets-staging.autoplants.cloud/default.jpg" } className="w-10 h-10 rounded-full" />
                <div className="flex flex-col">
                    <p>{editableName}</p>
                    <p>@{username}</p>
                </div>
            </div>
        </div>
    )
}

export default UserSearchComponent;