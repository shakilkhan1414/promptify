import PromptCard from "./PromptCard";
import Image from "next/image";
import Link from "next/link";

const Profile = ({ name, desc, data, handleEdit, handleDelete, noPost }) => {
  return (
    <section className='w-full'>
      <h1 className='head_text text-left'>
        <span className='blue_gradient'>{name} Profile</span>
      </h1>
      <p className='desc text-left'>{desc}</p>

      {noPost ? (
          <div className="flex items-center flex-col">
            <p className='nopost text-center'>No Propmts Found!</p>
            <br />
            <Link href='/create-prompt' className='black_btn new-prompt'>
              Create Your First Prompt
            </Link>
          </div>
      ):(
        data.length===0 && (
          <div className='w-full flex-center mt-6'>
            <Image
              src='/assets/icons/loader.svg'
              width={50}
              height={50}
              alt='loader'
              className='object-contain'
            />
          </div>
        )
      )}

      <div className='mt-10 prompt_layout'>
        {data.map((post) => (
          <PromptCard
            key={post._id}
            post={post}
            handleEdit={() => handleEdit && handleEdit(post)}
            handleDelete={() => handleDelete && handleDelete(post)}
          />
        ))}
      </div>
    </section>
  );
};

export default Profile;