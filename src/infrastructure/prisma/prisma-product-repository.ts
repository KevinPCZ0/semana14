import { BadRequestException, Injectable } from "@nestjs/common";
/* */
import { Product } from "../../domain/entities/product.entity";
/* */
import { PrismaService } from "./prisma.service";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

@Injectable()
export class PrismaProductRepository {
  constructor(private readonly prisma: PrismaService) { }
  async create(product: Product): Promise<Product | null> {
    try {
      // Verificar si el producto ya existe
      const existingProduct = await this.prisma.product.findFirst({
        where: {
          name: product.name,
          brand: product.brand,
          model: product.model,
          productCode: product.productCode,
        },
      });

      if (existingProduct) {
        throw new BadRequestException('El producto ya existe');
      }

      // Crear el producto
      const newProduct = await this.prisma.product.create({
        data: {
          name: product.name,
          brand: product.brand,
          model: product.model,
          description: product.description,
          category: product.category,
          stock: product.stock,
          productCode: product.productCode,
          status: product.status,
          branchId: product.branchId,
        },
      });

      // Retornar la instancia del nuevo producto (puedes retornar el nuevoProduct directamente si no necesitas la clase Product)
      return new Product(
        newProduct.name,
        newProduct.brand,
        newProduct.model,
        newProduct.description,
        newProduct.category,
        newProduct.stock,
        newProduct.productCode,
        newProduct.status,
        newProduct.branchId,
      );

    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
        // Código de error para violación de restricción única
        throw new BadRequestException('El producto ya existe');
      }
      throw error; // Re-lanzar otros errores
    }
  }

  async findAll(): Promise<Product[] | null> {
    return this.prisma.product.findMany();
  }

  async findOne(id: string): Promise<Product | null> {
    const numericId = parseInt(id, 10); 
    return this.prisma.product.findUnique({ where: { id:numericId } });
  }

  async update(id: string, data: Product): Promise<Product | null> {
    const numericId = parseInt(id, 10); 
    return this.prisma.product.update({
      where: { id: numericId },
      data,
    });
  }
}
