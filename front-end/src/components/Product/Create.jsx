import React from 'react'

const Create = () => {
    return (
        <div>
            <form>
                <input type="text" placeholder="Name" />
                <br/>
                <input type="number" placeholder="Price" />
                <br/>
                <textarea placeholder="Description" />
                <br/>
                <button type="submit">Create Product</button>
            </form>
        </div>
    )
}

export default Create