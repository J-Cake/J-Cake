import os
import template_utils

def template(file, wrapper, env = {}, glob = {}):
    with open(file, 'r') as html:
        if isinstance(wrapper, str):
            data = "<{tag}>{body}</{tag}>".format(tag=wrapper, body=html.read())
        else:
            data = html.read()

        with open(os.path.abspath('./template.html'), 'r') as file:
            template = file.read()
            file.close()
            
        template_vars = {
            'file': file,
            'body': data,
            'glob': glob,
            'final_path': env['out'][len(env['build']):] if env['out'].startswith(env['build']) else env['out']
        } | env

        while '<?py(' in template:
            block = template.index('<?py(')
            end = template.index(')?>', block)

            python = template[block + 5:end]

            template = template[:block] + str(eval(python, { k: getattr(template_utils, k) for k in dir(template_utils) if not k.startswith('_') }, template_vars)) + template[end + 3:]

        while '<?py{' in template:
            block = template.index('<?py{')
            end = template.index('}?>')

            python = template[block + 5:end]

            exec(python, { k: getattr(template_utils, k) for k in dir(template_utils) if not k.startswith('_') }, template_vars)

            template = template[:block] + template[end + 3:]

        html.close()
        
        return template
             
def escape(text):
    return text.replace('<', '&lt;').replace('>', '&gt;')
