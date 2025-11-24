import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import WorkerCard from './WorkerCard';
import DiagnoseModal from './DiagnoseModal';
import AddDataModal from './components/AddDataModal';
import { MOCK_WORKERS, MOCK_PRODUCTS, CATEGORIES_LIST, APP_NAME, TAGLINE } from './constants';
import { WorkerCategory, WorkerProfile, Product } from './types';

const App: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<WorkerCategory>(WorkerCategory.ALL);
  const [searchQuery, setSearchQuery] = useState("");
  
  // State initialization with LocalStorage check - UPDATED KEY TO v1 TO FORCE REFRESH
  const [workers, setWorkers] = useState<WorkerProfile[]>(() => {
    const saved = localStorage.getItem('skilledHelpers_workers_v1');
    return saved ? JSON.parse(saved) : MOCK_WORKERS;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('skilledHelpers_products_v1');
    return saved ? JSON.parse(saved) : MOCK_PRODUCTS;
  });

  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'about' | 'products' | 'others'>('home');
  const [filteredWorkers, setFilteredWorkers] = useState<WorkerProfile[]>(workers);

  // Save to LocalStorage whenever data changes - UPDATED KEY TO v1
  useEffect(() => {
    localStorage.setItem('skilledHelpers_workers_v1', JSON.stringify(workers));
  }, [workers]);

  useEffect(() => {
    localStorage.setItem('skilledHelpers_products_v1', JSON.stringify(products));
  }, [products]);

  // Filter logic
  useEffect(() => {
    let filtered = workers;

    if (activeCategory !== WorkerCategory.ALL) {
      filtered = filtered.filter(w => w.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(w => 
        w.name.toLowerCase().includes(q) || 
        w.services.some(s => s.toLowerCase().includes(q)) ||
        w.description.toLowerCase().includes(q)
      );
    }

    setFilteredWorkers(filtered);
  }, [activeCategory, searchQuery, workers]);

  const handleAddWorker = (newWorker: WorkerProfile) => {
    setWorkers(prev => [newWorker, ...prev]);
    setActiveCategory(WorkerCategory.ALL);
    setCurrentView('home');
  };

  const handleAddProduct = (newProduct: Product) => {
    setProducts(prev => [newProduct, ...prev]);
    setCurrentView('products');
  };

  const renderHome = () => (
    <div className="p-4 md:p-8 max-w-7xl mx-auto animate-fade-in-up">
      {/* Hero / Banner for Categories (Only on All) */}
      {activeCategory === WorkerCategory.ALL && !searchQuery && (
         <div className="mb-8 bg-gradient-to-r from-green-600 to-teal-600 rounded-3xl p-6 md:p-10 text-white shadow-xl shadow-green-600/20 relative overflow-hidden group">
            <div className="relative z-10 max-w-2xl animate-slide-in-right">
              <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider mb-2 border border-white/20">Welcome</div>
              <h1 className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-sm leading-tight">{TAGLINE}</h1>
              <p className="text-lg opacity-90 mb-8 max-w-lg leading-relaxed">Connect with skilled local professionals. Fair wages, quality work, stronger communities.</p>
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => setIsAIModalOpen(true)}
                  className="bg-white text-green-700 font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl hover:bg-green-50 hover:scale-105 transition-all flex items-center gap-2 group/btn"
                >
                   <i className="fas fa-robot text-orange-500 group-hover/btn:rotate-12 transition-transform"></i> Ask AI Helper
                </button>
                <button 
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-black/20 backdrop-blur-md border border-white/30 text-white font-bold py-3 px-6 rounded-full hover:bg-black/30 hover:scale-105 transition-all flex items-center gap-2"
                >
                   <i className="fas fa-plus"></i> List Your Service
                </button>
              </div>
            </div>
            {/* Decorative circles with animation */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full transform translate-x-1/3 -translate-y-1/3 animate-pulse-slow"></div>
            <div className="absolute bottom-0 right-20 w-32 h-32 bg-white opacity-10 rounded-full transform translate-y-1/2 animate-float"></div>
            <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-yellow-300 opacity-20 rounded-full blur-xl animate-pulse"></div>
         </div>
      )}

      {/* Category Pills (Mobile/Tablet scrolling) */}
      <div className="flex overflow-x-auto gap-3 pb-4 mb-4 md:hidden no-scrollbar animate-slide-in-right" style={{animationDelay: '0.1s'}}>
        {CATEGORIES_LIST.map(cat => (
          <button
            key={cat.name}
            onClick={() => setActiveCategory(cat.type)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border shadow-sm ${
              activeCategory === cat.type 
              ? 'bg-black text-white border-black scale-105 shadow-md' 
              : 'bg-white text-gray-700 border-gray-200 active:scale-95'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Workers Grid */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          {activeCategory === WorkerCategory.ALL ? (
            <><i className="fas fa-star text-yellow-500"></i> Recommended Professionals</>
          ) : (
            <><i className="fas fa-filter text-green-600"></i> {activeCategory}s</>
          )}
          {searchQuery && <span className="text-sm font-normal text-gray-500 ml-2">(Searching: "{searchQuery}")</span>}
        </h2>
        
        {filteredWorkers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredWorkers.map((worker, idx) => (
              <div key={worker.id} className="animate-fade-in-up" style={{ animationDelay: `${idx * 0.05}s` }}>
                <WorkerCard worker={worker} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300 animate-fade-in-up">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
               <i className="fas fa-search text-4xl"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">No professionals found</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">It looks quiet here. Try adjusting your search or category.</p>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="bg-green-600 text-white px-8 py-3 rounded-full font-bold hover:bg-green-700 hover:shadow-lg transition-all transform hover:-translate-y-1"
            >
              Add Professional
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="p-4 md:p-8 max-w-7xl mx-auto animate-fade-in-up">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wider mb-2">Marketplace</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tools & Equipment</h1>
          <p className="text-gray-600 text-lg">Essential gear for safety and professional results.</p>
        </div>
        <button onClick={() => setIsAddModalOpen(true)} className="hidden md:block bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-xl text-sm font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
           + Add Product
        </button>
      </div>
      
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product, idx) => (
            <div key={product.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden border border-gray-100 flex flex-col group animate-fade-in-up" style={{ animationDelay: `${idx * 0.05}s` }}>
               <div className="h-48 overflow-hidden bg-gray-100 relative">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-2 right-2 bg-white/95 backdrop-blur px-3 py-1 rounded-lg text-sm font-bold text-gray-800 shadow-sm border border-gray-100">
                    ₹{product.price}
                  </div>
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <button className="bg-white text-black px-4 py-2 rounded-full font-bold text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">Quick View</button>
                  </div>
               </div>
               <div className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                     <h3 className="font-bold text-gray-800 text-lg line-clamp-1 group-hover:text-blue-600 transition-colors">{product.name}</h3>
                     <div className="flex items-center text-yellow-500 text-xs bg-yellow-50 px-2 py-1 rounded-full">
                        <i className="fas fa-star mr-1"></i>{product.rating}
                     </div>
                  </div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-6 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    {product.category}
                  </p>
                  <button className="w-full mt-auto bg-gray-50 hover:bg-gray-900 text-gray-800 hover:text-white font-bold py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group/btn">
                    <i className="fas fa-shopping-cart group-hover/btn:scale-110 transition-transform"></i> Buy Now
                  </button>
               </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-blue-200 animate-fade-in-up">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-300">
             <i className="fas fa-box-open text-3xl"></i>
          </div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">Shelf is empty</h3>
          <p className="text-gray-400 mb-6">No products available at the moment.</p>
          <button onClick={() => setIsAddModalOpen(true)} className="text-blue-600 font-bold hover:underline hover:text-blue-800 transition-colors">
            Add a product now
          </button>
        </div>
      )}
    </div>
  );

  const renderOthers = () => (
    <div className="p-4 md:p-8 max-w-5xl mx-auto animate-fade-in-up">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Other Resources</h1>
      <div className="grid gap-6">
        <div 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-white p-8 rounded-2xl border border-gray-100 flex items-center gap-6 cursor-pointer hover:shadow-xl hover:border-blue-200 transition-all duration-300 group"
        >
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 text-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
             <i className="fas fa-plus"></i>
          </div>
          <div>
            <h3 className="font-bold text-xl text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">Add Listing</h3>
            <p className="text-gray-500">Register a professional service or list a new product for sale in the marketplace.</p>
          </div>
          <div className="ml-auto text-gray-300 group-hover:text-blue-600 group-hover:translate-x-2 transition-all">
            <i className="fas fa-chevron-right text-xl"></i>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-8 rounded-2xl text-white shadow-lg flex items-center justify-between relative overflow-hidden group cursor-pointer">
           <div className="relative z-10">
              <h3 className="font-bold text-xl mb-1">Join the Community</h3>
              <p className="opacity-90">Connect with other helpers and homeowners.</p>
           </div>
           <i className="fab fa-discord text-4xl opacity-80 group-hover:scale-110 transition-transform z-10"></i>
           <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white opacity-10 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
        </div>
      </div>
    </div>
  );

  const renderAbout = () => (
    <div className="max-w-4xl mx-auto p-4 md:p-10 flex flex-col items-center text-center animate-fade-in-up">
       
       {/* App Logo */}
       <div className="w-32 h-32 bg-gradient-to-br from-green-500 to-green-700 rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-green-500/30 mb-8 transform rotate-3 hover:rotate-0 hover:scale-110 transition-all duration-500 cursor-pointer">
          <i className="fas fa-hands-helping text-6xl drop-shadow-md"></i>
       </div>

       <h1 className="text-5xl font-bold text-gray-900 mb-4 tracking-tight">{APP_NAME}</h1>
       <p className="text-xl text-gray-600 mb-10 max-w-2xl font-light italic relative">
         <span className="text-green-300 text-6xl absolute -top-6 -left-4 opacity-50">"</span>
         {TAGLINE}
         <span className="text-green-300 text-6xl absolute -bottom-10 -right-4 opacity-50 leading-[0]">"</span>
       </p>
       
       <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 w-full max-w-3xl text-left relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 via-blue-500 to-purple-500"></div>
          
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-sm"><i className="fas fa-users"></i></span>
              About Us
            </h2>
            <p className="text-gray-600 leading-loose text-lg">
              We, <strong className="text-gray-800">Shruthika, Akshaya, and Advitha</strong>, are dedicated to helping people connect with skilled workers—such as plumbers, electricians, carpenters, and more—at affordable prices. 
              Our platform makes it easy to find reliable professionals who can fix, build, or repair anything you need, quickly and fairly. 
              Whether it’s a leaky tap, a wiring issue, or home improvement work, we help you find the right expert while saving your time and money. 
              At the same time, we ensure that hardworking labourers receive the opportunities and respect they deserve.
            </p>
          </div>

          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-sm"><i className="fas fa-bullseye"></i></span>
              Our Mission
            </h2>
            <p className="text-gray-600 leading-loose text-lg">
              Our mission is to uplift low-wage workers by providing them with a digital space where their skills are recognized, valued, and fairly compensated. 
              Through this initiative, we aim to support the <strong className="text-blue-600">“No Poverty”</strong> goal by bridging the gap between skilled labourers and households in need of affordable services. 
              We empower workers with better visibility and income opportunities, while offering the community trustworthy, budget-friendly services. 
              This platform is built to create a win-win ecosystem—where people can access quality help at low cost, and workers earn a fair livelihood with dignity.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-sm"><i className="fas fa-address-card"></i></span>
              Contact Us
            </h2>
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <div className="space-y-4 flex-1 w-full">
                 <div className="flex items-center gap-4 group">
                   <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform"><i className="fas fa-phone"></i></div>
                   <span className="font-semibold text-gray-700">+1 (800) SKILLED-HELP</span>
                 </div>
                 <div className="flex items-center gap-4 group">
                   <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform"><i className="fas fa-envelope"></i></div>
                   <span className="font-semibold text-gray-700">support@skilledhelpers.org</span>
                 </div>
                 <div className="flex items-center gap-4 group">
                   <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform"><i className="fas fa-map-marker-alt"></i></div>
                   <span className="font-semibold text-gray-700">Nizamabad, Telangana, India</span>
                 </div>
                 <div className="flex items-center gap-4 group">
                   <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform"><i className="fab fa-instagram"></i></div>
                   <span className="font-semibold text-gray-700">@skilled_helpers</span>
                 </div>
              </div>
              
              <div className="flex flex-col items-center">
                 <div className="bg-white p-2 rounded-xl shadow-md transform hover:scale-105 transition-transform duration-300">
                   <img 
                     src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://skilledhelpers.org" 
                     alt="QR Code" 
                     className="w-32 h-32 mb-2 mix-blend-multiply"
                   />
                 </div>
                 <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">Scan to Share</span>
              </div>
            </div>
          </div>
       </div>
    </div>
  );

  // Simple router switch
  let content;
  switch (currentView) {
    case 'home': content = renderHome(); break;
    case 'products': content = renderProducts(); break;
    case 'others': content = renderOthers(); break;
    case 'about': content = renderAbout(); break;
    default: content = renderHome();
  }

  return (
    <div className="text-gray-800">
      <Layout 
        activeCategory={activeCategory} 
        onCategoryChange={setActiveCategory}
        onSearch={(query) => {
            setSearchQuery(query);
            if (query.trim()) {
                setActiveCategory(WorkerCategory.ALL); // Reset category on search to find all results
                setCurrentView('home');
            }
        }}
        onOpenAI={() => setIsAIModalOpen(true)}
        onOpenAdd={() => setIsAddModalOpen(true)}
        currentView={currentView}
        onChangeView={setCurrentView}
      >
        {content}
      </Layout>

      <DiagnoseModal 
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        onCategorySelect={(cat) => {
            setActiveCategory(cat as WorkerCategory);
            setCurrentView('home');
        }}
      />

      <AddDataModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddWorker={handleAddWorker}
        onAddProduct={handleAddProduct}
      />
    </div>
  );
};

export default App;