const addRecipeToHistory = async (recipe) => {
    try {
      const response = await fetch('http://localhost:3000/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'username',  // Replace with actual username
          ...recipe,
        }),
      });
      const data = await response.json();
      if (data.message === "Recipe added to history.") {
        console.log("Recipe added successfully.");
      }
    } catch (error) {
      console.error("Error adding recipe:", error);
    }
  };
  