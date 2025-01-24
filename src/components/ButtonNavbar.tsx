interface ButtonNavbarProps {
    name?: string;
    nameRedirect?:string;
    pathContent: string;
}

function ButtonNavbar({ name, nameRedirect, pathContent }: ButtonNavbarProps) {
    return (
        <a className="flex w-fit items-center justify-start gap-2 h-10 p-4 lg:text-2xl text-xl text-white rounded-full hover:bg-gray-300" href={nameRedirect}>
            <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5 2xl:w-6 2xl:h-6 fill-white">
                <g>
                    <path d={pathContent}></path>
                </g>
            </svg>
            <h2 className="text-white hidden xl:block 2xl:text-2xl text-xl">{name}</h2>
        </a>
    )
}

export default ButtonNavbar;