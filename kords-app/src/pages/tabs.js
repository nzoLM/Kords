import { Button } from "@/components/ui/button";

export default function Tabs() {
    const testAPI = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tabs/search?pattern=wonderwall`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        
            const data = await response.json();
            console.log('Résultats de la recherche:', data);

        } catch (error) {
            console.error('Erreur API:', error);
        }
    }

    return (
        <div>
            <Button onClick={testAPI}>Tabs</Button>
        </div>
    )
}