import * as Yup from 'yup';
import Category from '../models/Category';
import User from '../models/User';

class CategoryController {
  async store(request, response) {
    const schema = Yup.object({   
    })

    try {
        schema.validateSync(request.body, { abortEarly: false });
    } catch (err) {
        return response.status(400).json({ error: err.errors });
    }

    const { admin: isAdmin } = await User.findByPk(request.userId);
    if (!isAdmin) {
        return response.status(401).json({ error: 'User is not admin' });
    }

    const { filename: path} = request.file;
    const { name } = request.body;

    const categoryExists = await Category.findOne({
         where: { 
            name, 
        } 
    });

    if (categoryExists) {
        return response.status(400).json({ error: 'Category already exists.' });
    }

    const { id } = await Category.create({
        name,
        path,
    });

    return response.status(201).json({id, name});
  }

     async update(request, response) {
    const schema = Yup.object({   
        name: Yup.string(),
    })

    try {
        schema.validateSync(request.body, { abortEarly: false });
    } catch (err) {
        return response.status(400).json({ error: err.errors });
    }

    const { admin: isAdmin } = await User.findByPk(request.userId);
    if (!isAdmin) {
        return response.status(401).json({ error: 'User is not admin' });
    }

    const { id } = request.params;

    const categoryExists = await Category.findByPk(id);

    if (!categoryExists) {
        return response.status(400).json({ error: 'Category does not exist.' });
    }

    let path;
    if (request.file) {
        path = request.file.filename;
    }
    const { name } = request.body;

    if (name) {
        const categoryNameExists = await Category.findOne({
            where: {
                name,
            }
        })
    }

    const categoryNameExists = await Category.findOne({
         where: { 
            name, 
        } 
    });

    if (categoryNameExists) {
        return response.status(400).json({ error: 'Category already exists.' });
    }

    await categoryExists.update(    
        {
            name,
            path
        }
    );

    return response.status(200).json({ id: categoryExists.id, name: name || categoryExists.name });
  }

    async index(request, response) {
        const categories = await Category.findAll({
        });
    
        return response.json(categories);
    }
}
export default new CategoryController();

        
