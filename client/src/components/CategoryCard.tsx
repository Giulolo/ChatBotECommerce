import { Link } from 'wouter';
import { Category } from '@shared/schema';

interface CategoryCardProps {
  category: Category;
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  return (
    <Link href={`/category/${category.slug}`} className="group cursor-pointer">
      <div className="bg-white rounded-xl overflow-hidden shadow-md transition-all hover:shadow-lg group-hover:-translate-y-1">
        <div className="aspect-square relative overflow-hidden">
          <img 
            src={category.imageUrl || ''}
            alt={`Categoría ${category.name}`}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end">
            <h3 className="text-white font-poppins font-medium p-4">{category.name}</h3>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
