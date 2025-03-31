import React from "react";
import "./Modal.css";

const Modal = ({ isOpen, closeModal, title, explanation }) => {
  if (!isOpen) return null;

  // Separar la explicación por "//"
  const explanationParts = explanation.split("//");

  return (
    <div className="fixed modal h-screen inset-0 flex justify-center items-center backdrop-blur-sm z-70">
      <div className="bg-white w-fit mx-3.5 mt-16 animate-fade-in-down overflow-y-auto modal-container relative p-6 rounded-lg shadow-lg">
        <a
          onClick={closeModal}
          className="absolute hover:scale-105 icon-close top-2 right-2 text-xl w-6 cursor-pointer rounded-4xl  text-black"
        />
        <h2 className="text-2xl text-black font-bold mb-4">{title}</h2>
        {/* Mostrar cada parte de la explicación */}
        {explanationParts.map((part, index) => (
          <p key={index} className="text-gray-700 mb-2 text-left">
            {part.trim()}
          </p>
        ))}
      </div>
    </div>
  );
};

export default Modal;
