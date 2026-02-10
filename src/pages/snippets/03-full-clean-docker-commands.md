---
  title: 'Full clean docker commands'
  author: 'Francisco Gonzalez'
  description: 'Full clean docker commands.'
  pubDate: 2024-02-07
  image:
    url: 'https://docs.astro.build/assets/full-logo-light.png'
    alt: 'The full Astro logo.'
  tags: ["docker", "devops"]
  layout: ./../../layouts/MarkdownPostLayout.astro
---

## Total clean

```bash
sudo docker stop $(docker ps -a -q) || echo "Nothing to delete" && sudo docker rm $(docker ps -a -q) || echo "Nothing to delete" && docker ps -a && docker rmi $(docker images -a -q) || echo "Nothing to delete" && docker volume rm $(docker volume ls -q) || echo "Nothing to delete" && docker system prune -a
```

## Clean all containers

```bash
sudo docker stop $(docker ps -a -q) || echo "Nothing to delete" && sudo docker rm $(docker ps -a -q) || echo "Nothing to delete" && docker ps -a
```

## Clean up unused Docker images
```bash
docker system prune -a -f
```