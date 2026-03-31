import { useAppStore } from "../../app/stores/useAppStore";

// Definimos la interfaz local para no depender de services/drinks
interface Drink {
  id: number;
  name: string;
  category?: string;
  image_path?: string;
  price?: number;
}

type Props = {
  drink: Drink;
};

export default function DrinkCard({ drink }: Props) {
  // Las imágenes ahora deben estar en /public/ o ser rutas relativas locales
  const imageUrl = drink.image_path ? drink.image_path : "/placeholder-drink.jpg";

  const openDrinkModal = useAppStore((s) => s.openDrinkModal);

  return (
    <div className="border border-slate-200 rounded-xl shadow-lg overflow-hidden bg-white">
      <div className="overflow-hidden">
        <img
          src={imageUrl}
          alt={drink.name}
          className="hover:scale-125 transition-transform hover:rotate-2 w-full h-56 object-cover"
        />
      </div>

      <div className="p-5">
        <h2 className="text-2xl truncate font-black">{drink.name}</h2>
        <p className="text-slate-500 mt-1">{drink.category ?? "Sin categoría"}</p>

        <button
          type="button"
          className="bg-orange-400 hover:bg-orange-600 mt-5 w-full p-3 font-bold text-white text-lg rounded-lg transition-colors"
          onClick={() => openDrinkModal(drink)}
        >
          Ver detalle
        </button>
      </div>
    </div>
  );
}