import useLoad from '../API/useLoad';

function AuthorCard({ author }) {
  const works = author.works || [];

  return (
    <div className='bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition flex flex-col'>
      <h2 className='text-lg font-serif font-semibold text-gray-900 mb-1'>{author.title}</h2>

      <h3 className='text-sm font-medium text-gray-700 mb-2'>Works:</h3>

      {works.length > 0 ? (
        <ul className='list-disc ml-5 text-sm text-gray-600 space-y-1'>
          {works.map((w) => (
            <li key={w.id}>{w.title}</li>
          ))}
        </ul>
      ) : (
        <p className='text-sm text-gray-500 italic'>No works found.</p>
      )}
    </div>
  );
}

export default AuthorCard;
