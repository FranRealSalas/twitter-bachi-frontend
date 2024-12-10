interface ButtonNavbarProps {
    name?: string;
    nameRedirect?:string;
    pathContent: string;
}

function ButtonNavbar({ name, nameRedirect, pathContent }: ButtonNavbarProps) {
    return (
        <a className="flex w-fit items-center justify-start gap-2 h-10 p-4 text-2xl text-white rounded-3xl hover:bg-gray-300" href={nameRedirect}>
            <svg viewBox="0 0 24 24" aria-hidden="true" className="w-6 h-6 fill-white">
                <g>
                    <path d={pathContent}></path>
                </g>
            </svg>
            <h2 className="text-white">{name}</h2>
        </a>
    )
}

export default ButtonNavbar;