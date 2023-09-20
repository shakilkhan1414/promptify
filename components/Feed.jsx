"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

import PromptCard from "./PromptCard";

const PromptCardList = ({ data, handleTagClick }) => {
  return (
    <div className='mt-5 prompt_layout'>
      {data.map((post) => (
        <PromptCard
          key={post._id}
          post={post}
          handleTagClick={handleTagClick}
        />
      ))}
    </div>
  );
};

const Feed = () => {
  const [allPosts, setAllPosts] = useState([]);

  // Search states
  const [searchText, setSearchText] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchedResults, setSearchedResults] = useState([]);

  const fetchPosts = async (maxRetries = 300) => {
    let retries = 0;
  
    while (retries < maxRetries) {
      try {
        const response = await fetch("/api/prompt");
  
        if (!response.ok) {
          console.log('Not okay, retrying...');
          retries++;
          if (retries === maxRetries) {
            throw new Error(`Fetch failed after ${maxRetries} retries with status ${response.status}`);
          }
        } else {
          const data = await response.json();
          setAllPosts(data);
          break; 
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        retries++;
        if (retries === maxRetries) {
          throw new Error(`Fetch failed after ${maxRetries} retries: ${error}`);
        }
      }
    }
  };
  
  useEffect(() => {
    fetchPosts();
  }, []);
  

  const filterPrompts = (searchtext) => {
    const regex = new RegExp(searchtext, "i"); // 'i' flag for case-insensitive search
    return allPosts.filter(
      (item) =>
        regex.test(item.creator.username) ||
        regex.test(item.tag) ||
        regex.test(item.prompt)
    );
  };

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    // debounce method
    setSearchTimeout(
      setTimeout(() => {
        const searchResult = filterPrompts(e.target.value);
        setSearchedResults(searchResult);
      }, 500)
    );
  };

  const handleTagClick = (tagName) => {
    setSearchText(tagName);

    const searchResult = filterPrompts(tagName);
    setSearchedResults(searchResult);
  };

  return (
    <section className='feed'>
      <form className='relative w-full flex-center'>
        <input
          type='text'
          placeholder='Search for prompt, tag or username'
          value={searchText}
          onChange={handleSearchChange}
          required
          className='search_input peer'
        />
      </form>

      {allPosts.length===0 && (
        <div className='w-full flex-center mt-2'>
          <Image
            src='/assets/icons/loader.svg'
            width={50}
            height={50}
            alt='loader'
            className='object-contain'
          />
        </div>
        )}

      {searchText && (
        searchedResults.length===0 && (
          <p className='desc text-center'>No Propmts Found!</p>
        )
      )}

      {/* All Prompts */}
      {searchText ? (
        <PromptCardList
          data={searchedResults}
          handleTagClick={handleTagClick}
        />
      ) : (
        <PromptCardList data={allPosts} handleTagClick={handleTagClick} />
      )}
    </section>
  );
};

export default Feed;