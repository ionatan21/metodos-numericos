import React from "react";
import "./Modal.css";

const Modal = ({ isOpen, closeModal, title, explanation }) => {
  if (!isOpen) return null;

  // Separar la explicación por "//"
  const explanationParts = explanation.split("//");

  return (
    <div className="fixed h-screen  inset-0 flex justify-center items-center backdrop-blur-sm z-50">
      <div className="bg-white mt-16 modal-container relative p-6 rounded-lg shadow-lg w-11/12 sm:w-1/3">
        <a
          onClick={closeModal}
          className="absolute top-2 right-2 text-xl bg-gray-400 w-6 cursor-pointer rounded-4xl  text-black"
        >
          ×
        </a>
        <h2 className="text-2xl text-black font-bold mb-4">{title}</h2>
        {/* Mostrar cada parte de la explicación */}
        {explanationParts.map((part, index) => (
          <p key={index} className="text-gray-700 mb-2">
            {part.trim()}
          </p>
        ))}
      </div>
    </div>
  );
};

export default Modal;
