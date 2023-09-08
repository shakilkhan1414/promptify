'use client'

import { useState,useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Form from "@/components/Form"

const page = () => {
  const router=useRouter()
  const {data: session}=useSession()

  useEffect(() => {
    if(!session){
      router.push('/')
    }

  }, []);

    const [submitting,setSubmitting]=useState(false)
    const [post,setPost]=useState({
        prompt:'',
        tag: '',
    })

    const createPrompt= async (e)=>{
      e.preventDefault()
      setSubmitting(true)
      
      try{
        const response=await fetch('/api/prompt/create',{
          method: 'POST',
          body:JSON.stringify({
            prompt: post.prompt,
            userId: session?.user.id,
            tag: post.tag,
          })
        })

        if (response.ok) {
          router.push("/profile");
        }

      }
      catch(error){
        console.log(error)
      }
      finally{
        setSubmitting(false)
      }
    }

  return (
    <Form type="Create" post={post} setPost={setPost} submitting={submitting} handleSubmit={createPrompt} />
  )
}

export default page
