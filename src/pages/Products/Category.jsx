import { useParams } from 'react-router-dom';
import Search from './Search';

// For simplicity in this demo, Category page reuses the Search page logic 
// with the category filter pre-applied (though here we just render Search since Search reads url params/state.
// In a real app, Category page could fetch distinct data or have a unique banner).
export default function Category() {
  const { id } = useParams();
  
  return (
    <div className="pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white capitalize">{id.replace('-', ' ')} Medicines</h1>
      </div>
      <Search />
    </div>
  );
}
