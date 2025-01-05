import { Supabase } from '@/lib/supabase/Supabase'

async function Page() {
  return (
    <main className="w-[500px] mx-auto p-4 border border-green-500">
      <div className="overflow-x-auto">
        <table className="table-auto border-collapse border border-gray-200 w-full">
          <thead>
            <tr>
              <th className="border border-gray-200 px-4 py-2">Header 1</th>
              <th className="border border-gray-200 px-4 py-2">Header 2</th>
              <th className="border border-gray-200 px-4 py-2">Header 3</th>
              <th className="border border-gray-200 px-4 py-2">Header 4</th>
              <th className="border border-gray-200 px-4 py-2">Header 5</th>
              <th className="border border-gray-200 px-4 py-2">Header 6</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-200 px-4 py-2 text-nowrap">
                Row 1 Col 1
              </td>
              <td className="border border-gray-200 px-4 py-2 text-nowrap">
                Row 1 Col 2
              </td>
              <td className="border border-gray-200 px-4 py-2 text-nowrap">
                Row 1 Col 3
              </td>
              <td className="border max-w-[300px] overflow-hidden text-ellipsis border-gray-200 px-4 py-2 text-nowrap">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                Architecto, adipisci necessitatibus harum inventore mollitia
                nihil vel at minus exercitationem, debitis voluptates laborum
                delectus deleniti soluta pariatur. Exercitationem placeat natus
                minima vitae nihil eveniet aliquam sequi animi ullam quidem esse
                error consequuntur consequatur dolore provident mollitia quas
                cumque, in vero sint.
              </td>
            </tr>
            <tr>
              <td className="border border-gray-200 px-4 py-2 text-nowrap">
                Row 2 Col 1
              </td>
              <td className="border border-gray-200 px-4 py-2 text-nowrap">
                Row 2 Col 2
              </td>
              <td className="border border-gray-200 px-4 py-2 text-nowrap">
                Row 2 Col 3
              </td>
              <td className="border border-gray-200 px-4 py-2 text-nowrap">
                Row 2 Col 4
              </td>
            </tr>
            <tr>
              <td className="border border-gray-200 px-4 py-2 text-nowrap">
                Row 2 Col 1
              </td>
              <td className="border border-gray-200 px-4 py-2 text-nowrap">
                Row 2 Col 2
              </td>
              <td className="border border-gray-200 px-4 py-2 text-nowrap">
                Row 2 Col 3
              </td>
              <td className="border border-gray-200 px-4 py-2 text-nowrap">
                Row 2 Col 4
              </td>
            </tr>
            <tr>
              <td className="border border-gray-200 px-4 py-2 text-nowrap">
                Row 2 Col 1
              </td>
              <td className="border border-gray-200 px-4 py-2 text-nowrap">
                Row 2 Col 2
              </td>
              <td className="border border-gray-200 px-4 py-2 text-nowrap">
                Row 2 Col 3
              </td>
              <td className="border border-gray-200 px-4 py-2 text-nowrap">
                Row 2 Col 4
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  )
}

export default Page
