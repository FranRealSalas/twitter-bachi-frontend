import { Image } from "@/types/image";
import { Dispatch, SetStateAction, useState } from "react";
import AbsoluteModal from "./AbsoluteModal";

const ModalContentImages = ({ openModalImage, setOpenModalImage, images, index }: { openModalImage: boolean, setOpenModalImage: Dispatch<SetStateAction<boolean>>, images: Image[], index: number }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(index);

    const prevImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    };

    const nextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    };

    return (
        <AbsoluteModal open={openModalImage} setClose={setOpenModalImage}>
            <div className="flex w-full h-full justify-center items-center">
                <button onClick={prevImage} className="absolute left-4 top-1/2 transform -translate-y-1/2 hover:bg-gray-500 p-2 rounded-full">
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="fill-white w-5">
                        <g>
                            <path d="M7.414 13l5.043 5.04-1.414 1.42L3.586 12l7.457-7.46 1.414 1.42L7.414 11H21v2H7.414z"></path>
                        </g>
                    </svg>
                </button>
                <img
                    className="h-96 rounded-2xl"
                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}api/tweets/uploads/tweetImages/${images[currentImageIndex].imageName}`}
                />
                <button onClick={nextImage} className="absolute right-4 top-1/2 transform -translate-y-1/2 hover:bg-gray-500 p-2 rounded-full">
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="fill-white w-5">
                        <g>
                            <path d="M12.957 4.54L20.414 12l-7.457 7.46-1.414-1.42L16.586 13H3v-2h13.586l-5.043-5.04 1.414-1.42z"></path>
                        </g>
                    </svg>
                </button>
            </div>
        </AbsoluteModal>
    );
}

export default ModalContentImages;