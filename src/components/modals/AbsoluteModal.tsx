import { useOutsideAlerter } from "@/utils/outsideAlerter";
import { Dispatch, ReactNode, SetStateAction, useRef } from "react";

export default function AbsoluteModal({ open, setClose, children }: { open: boolean, setClose: Dispatch<SetStateAction<boolean>>, children: ReactNode }) {
    const modalRef = useRef(null);

    useOutsideAlerter(modalRef, setClose);

    return (
        <>
            {open ?
                <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-[2px]">
                    <div className="relative sm:w-3/6 w-4/5 shadow-lg bg-green-dark text-white rounded-xl p-4 gap-6 flex flex-col" ref={modalRef}>
                        <button onClick={(e) => {
                            e.preventDefault()
                            setClose(!modalRef)
                         }}
                            className="w-6 bg-white rounded-full hover:scale-105 absolute right-2 top-2">
                            <img src="https://assets.autoplants.cloud/images/x-icon.svg" />
                        </button>
                        {children}
                    </div>
                </div>
                : <></>
            }
        </>
    )
}