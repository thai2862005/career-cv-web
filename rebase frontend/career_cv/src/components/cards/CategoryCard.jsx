import { Link } from 'react-router-dom';
import { 
  FiCode, 
  FiDollarSign, 
  FiTrendingUp, 
  FiHeart, 
  FiShoppingBag,
  FiTruck,
  FiHome,
  FiUsers,
  FiSettings,
  FiBook
} from 'react-icons/fi';

const CategoryCard = ({ category }) => {
  const { id, name, icon, _count } = category;

  const getIcon = (iconName) => {
    const icons = {
      code: FiCode,
      finance: FiDollarSign,
      marketing: FiTrendingUp,
      healthcare: FiHeart,
      retail: FiShoppingBag,
      logistics: FiTruck,
      realestate: FiHome,
      hr: FiUsers,
      engineering: FiSettings,
      education: FiBook
    };
    const IconComponent = icons[iconName] || FiSettings;
    return <IconComponent className="w-6 h-6" />;
  };

  const getGradient = (iconName) => {
    const gradients = {
      code: 'from-blue-500 to-blue-600',
      finance: 'from-green-500 to-green-600',
      marketing: 'from-purple-500 to-purple-600',
      healthcare: 'from-red-500 to-red-600',
      retail: 'from-orange-500 to-orange-600',
      logistics: 'from-yellow-500 to-yellow-600',
      realestate: 'from-teal-500 to-teal-600',
      hr: 'from-pink-500 to-pink-600',
      engineering: 'from-indigo-500 to-indigo-600',
      education: 'from-cyan-500 to-cyan-600'
    };
    return gradients[iconName] || 'from-gray-500 to-gray-600';
  };

  return (
    <Link
      to={`/jobs?category=${id}`}
      className="block bg-white rounded-xl border border-gray-200 hover:border-green-300 hover:shadow-lg transition-all duration-300 p-5 group text-center"
    >
      <div className={`w-14 h-14 mx-auto rounded-xl bg-gradient-to-r ${getGradient(icon)} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
        {getIcon(icon)}
      </div>
      <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition mb-1">
        {name}
      </h3>
      {_count?.jobPosts !== undefined && (
        <p className="text-sm text-gray-500">
          {_count.jobPosts} việc làm
        </p>
      )}
    </Link>
  );
};

export default CategoryCard;
