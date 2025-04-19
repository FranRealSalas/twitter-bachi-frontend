interface UserSearchComponentProps {
    username: string;
    editableName: string;
}

function UserSearchComponent({ username, editableName }: UserSearchComponentProps) {
    return (
        <div className="flex flex-col p-2 hover:bg-gray-400 cursor-pointer">
            <div className="flex flex-row gap-1 items-center">
                <img src={`${process.env.NEXT_PUBLIC_BACKEND_URL}api/users/uploads/profile/img/${username}`} onError={(e)=> e.currentTarget.src="https://assets-staging.autoplants.cloud/default.jpg" } className="w-10 h-10 rounded-full" />
                <div className="flex flex-col">
                    <p>{editableName}</p>
                    <p>@{username}</p>
                </div>
            </div>
        </div>
    )
}

export default UserSearchComponent;