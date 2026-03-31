import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { useAppStore } from "../../app/stores/useAppStore";

export default function DrinkDetailsModal() {
  const modal = useAppStore((s) => s.modal);
  const selectedDrink = useAppStore((s) => s.selectedDrink);
  const closeDrinkModal = useAppStore((s) => s.closeDrinkModal);

  // Estado local para simular favoritos sin hooks
  const [isFav, setIsFav] = useState(false);

  // La imagen se toma de la ruta local (ej: /assets/...)
  const imageUrl = selectedDrink?.image_path || null;

  return (
    <>
      <Transition appear show={modal} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeDrinkModal}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-slate-400/65" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6">
                  {!selectedDrink ? (
                    <div className="p-6 text-center">
                      <p className="text-gray-700">No hay trago seleccionado.</p>
                      <button type="button" className="mt-4 w-full rounded bg-gray-600 p-3 font-bold uppercase text-white" onClick={closeDrinkModal}>Cerrar</button>
                    </div>
                  ) : (
                    <>
                      <Dialog.Title as="h3" className="text-gray-900 text-4xl font-extrabold my-5 text-center">
                        {selectedDrink.name}
                      </Dialog.Title>

                      {imageUrl && <img src={imageUrl} alt={selectedDrink.name} className="mx-auto w-96 rounded-lg" />}

                      <div className="mt-5 space-y-4 text-gray-800">
                        <p className="text-lg"><span className="font-bold">Categoría:</span> {selectedDrink.category || 'General'}</p>
                        <p className="font-bold text-2xl text-orange-500">${selectedDrink.price}</p>
                      </div>

                      <div className="mt-5 flex justify-between gap-4">
                        <button type="button" className="w-full rounded bg-gray-200 p-3 font-bold uppercase text-gray-700" onClick={closeDrinkModal}>Cerrar</button>
                        <button
                          type="button"
                          className={`w-full rounded p-3 font-bold uppercase text-white shadow transition ${isFav ? "bg-slate-700" : "bg-orange-500"}`}
                          onClick={() => setIsFav(!isFav)}
                        >
                          {isFav ? "Eliminar favorito" : "Agregar a Favoritos"}
                        </button>
                      </div>
                    </>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}