// import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from "@nestjs/common";
// import { ArticlesService } from "./articles.service";
// import { CreateArticleDto } from "./dto/create-article.dto";
// import { UpdateArticleDto } from "./dto/update-article.dto";

// @Controller("articles")
// export class ArticlesController {
//   constructor(private readonly articlesService: ArticlesService) {}

//   @Post()
//   create(@Body() dto: CreateArticleDto) {
//     return this.articlesService.create(dto);
//   }

//   @Get()
//   findAll(
//     @Query("page") page?: string,
//     @Query("limit") limit?: string,
//     @Query("q") q?: string
//   ) {
//     return this.articlesService.findAll({
//       page: page ? parseInt(page) : undefined,
//       limit: limit ? parseInt(limit) : undefined,
//       q: q || undefined
//     });
//   }


//   @Get(":slug")
//   findOne(@Param("slug") slug: string) {
//     return this.articlesService.findBySlug(slug);
//   }

//   @Patch(":id")
//   update(@Param("id") id: string, @Body() dto: UpdateArticleDto) {
//     return this.articlesService.update(id, dto);
//   }

//   @Delete(":id")
//   remove(@Param("id") id: string) {
//     return this.articlesService.remove(id);
//   }
// }






import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from "@nestjs/common";
import { ArticlesService } from "./articles.service";
import { CreateArticleDto } from "./dto/create-article.dto";
import { UpdateArticleDto } from "./dto/update-article.dto";
import { ListArticlesDto } from "./dto/list-articles.dto";

@Controller("articles")
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  create(@Body() dto: CreateArticleDto) {
    return this.articlesService.create(dto);
  }

  @Get()
  findAll(@Query() q: ListArticlesDto) {
    return this.articlesService.findAll(q); // sẽ trả {items, meta}
  }

  @Get(":slug")
  findOne(@Param("slug") slug: string) {
    return this.articlesService.findBySlug(slug);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateArticleDto) {
    return this.articlesService.update(id, dto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.articlesService.remove(id);
  }
}
