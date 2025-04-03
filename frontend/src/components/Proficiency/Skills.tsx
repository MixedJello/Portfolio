import Image from 'next/image'

import React from 'react'



const backend = [
    {
        source: "python",
        title: "Python"
    },
    {
        source: "Csharp",
        title: "C#"
    },
    {
        source: "Go",
        title: "GO"
    },
    {
        source: "sql",
        title: "SQL"
    },
    {
        source: "django",
        title: "Django"
    }
]
const frontend = [
    {
        source: "html",
        title: "HTML"
    },
    {
        source: "css",
        title: "CSS"
    },
    {
        source: "javascript",
        title: "JavaScript"
    },
    {
        source: "typescript",
        title: "TypeScript"
    },
    {
        source: "react",
        title: "React"
    },
]

const devops = [
    {
        source: "git",
        title: "Git"
    },
    {
        source: "github",
        title: "GitHub"
    },
    {
        source: "docker",
        title: "Docker"
    },
    {
        source: "aws",
        title: "Amazon AWS"
    },
]

export default function Skills() {
    return (
        <section id="skills" className='text-center'>
            <h2 className='fnt-1'>Programming Proficiencies</h2>
            <div className='backend my-10'>
                <h3 className='mb-5'>Backend Development</h3>
                <div className='flex justify-center flex-col items-center xl:flex-row gap-5'>
                    {backend.map((language) => (
                        <div className='flex gap-5 items-center pill-bg' key={language.title}>
                            <Image width={50} height={50} src={`/assets/logo/${language.source}.svg`} alt={language.title}/>
                            <strong>{language.title}</strong>
                        </div>
                    ))}
                </div>
            </div>
            <div className='frontend mb-10'>
                <h3 className='mb-5'>Frontend Development</h3>
                <div className='flex justify-center flex-col items-center xl:flex-row gap-5'>
                    {frontend.map((language) => (
                        <div className='flex gap-5 items-center pill-bg' key={language.title}>
                            <Image width={50} height={50} src={`/assets/logo/${language.source}.svg`} alt={language.title}/>
                            <strong>{language.title}</strong>
                        </div>
                    ))}
                </div>
            </div>
            <div className='devops mb-10'>
                <h3 className='mb-5'>DevOps & Cloud</h3>
                <div className='flex justify-center flex-col items-center xl:flex-row gap-5'>
                    {devops.map((language) => (
                        <div className='flex gap-5 items-center pill-bg' key={language.title}>
                            <Image width={50} height={50} src={`/assets/logo/${language.source}.svg`} alt={language.title}/>
                            <strong>{language.title}</strong>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
