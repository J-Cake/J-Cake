# MRBS

The [Meeting Room Booking System](https://mrbs.sourceforge.io/) (I read it as _murbs_ in my head) is a software to book meeting rooms.
As I unfortunately found the provided documentation to require a lot of interpretation, especially due to my lack of experience with PHP, I spent a whole three days attempting to set up the software. 
I can imagine that this would shy away users in a similar situation with slightly less ambition or time than myself. A true shame because once you get through the setup, the software is incredibly powerful and highly customisable.
Not to mention mine and my company's strong tendancies to focus on fail-safety and performance, there were a number of tweaks I wanted to make to the system. 

The system I now have working uses the following software for a completely open-source and self-hosted stack:
* [Docker](https://www.docker.com/)
* [PostgreSQL](https://www.postgresql.org/)
* [FrankenPHP](https://frankenphp.dev/) (based on [Caddy](https://caddyserver.com/))
* [Ubuntu](https://ubuntu.com/)
* [Univention Corporate Server](https://www.univention.com/products/ucs/)
* [Proxmox](https://www.proxmox.com/en/proxmox-virtual-environment/overview)

I use this system for multiple reasons:
1. The system behaves more like a microkernel system, so smaller components hot-swappable
2. The system is crash-safe, containing smaller failures within the container they take place
3. The system is fast - like, fucking fast
4. Automatic HTTPS thanks to Caddy
5. Automatic user-access management
6. Automatic backups thanks to Proxmox automatic backups
7. It's easy to set up

## Setup

Aight, less self-promotion, more setup!

For the sake of conciseness, I'll go out on a limb and assume you've already got a blank Ubuntu Server installation with which you can work. If not, start there. 
The proxmox hypervisor is not strictly necessary, I just use it to distribute the available computing resources to various services I use across the company. 
One of which is the UCS instance acting as a Domain Controller slave node, which provides authentication and LDAP replication. I also won't cover its setup because that's a can of worms itself.

1. Install Docker

There are multiple ways to install docker. Choose the method which works best for you. 
On my testing machine, I used the [Docker installation script]([https://docs.docker.com/engine/install/ubuntu/](https://docs.docker.com/engine/install/ubuntu/#install-using-the-convenience-script))
because it's easy and works reliably. **[Docker advises against this for production a service](https://docs.docker.com/engine/install/ubuntu/#installation-methods)**.

### Install Script
```nu
> http get 'https://get.docker.com' | sudo sh
```

### Manual Install

I downloaded the latest of each resource [from here](https://download.docker.com/linux/ubuntu/dists/mantic/pool/stable/amd64/). 
Obviously, adjust the various parameters in the URL to match your system. 

Using dpkg, I install each.

```nu
> sudo dpkg -i ~/Download/*docker*.deb ~/Download/containerd*.deb
```

